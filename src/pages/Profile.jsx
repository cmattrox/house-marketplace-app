import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
	const auth = getAuth();

	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState(null);
	const [changeDetails, setChangeDetails] = useState(false);
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});

	const { name, email } = formData;

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, 'listings');

			const q = query(
				listingsRef,
				where('userRef', '==', auth.currentUser.uid),
				orderBy('timestamp', 'desc')
			);

			const querySnap = await getDocs(q);

			let listings = [];

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings(listings);
			setLoading(false);
		};

		fetchUserListings();
	}, [auth.currentUser.uid]);

	const onLogout = () => {
		auth.signOut();
		navigate('/');
	};

	const onSubmit = async () => {
		try {
			if (
				auth.currentUser.displayName !== name ||
				auth.currentUser.email !== email
			) {
				if (auth.currentUser.displayName !== name) {
					// Update display name in fb
					await updateProfile(auth.currentUser, {
						displayName: name,
						email: email,
					})
						.then(() => {
							toast.success(
								'User profile name has been changed successfully'
							);
						})
						.catch((error) => {
							toast.error(
								'User profile name could not be updated'
							);
						});
				}

				if (auth.currentUser.email !== email) {
					await updateEmail(auth.currentUser, email)
						.then(() => {
							toast.success(
								'User profile email has been changed successfully'
							);
						})
						.catch((error) => {
							console.log(error);
							toast.error(
								'User profile email could not be updated'
							);
						});
				}

				// Update in firestore
				const userRef = doc(db, 'users', auth.currentUser.uid);
				await updateDoc(userRef, {
					name,
					email,
				});
			}
		} catch (error) {
			toast.error('Could not update profile details');
		}
	};

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onDelete = async (listingId) => {
		if (window.confirm('Are you sure you want to delete this listing?')) {
			await deleteDoc(doc(db, 'listings', listingId));
			const updatedListings = listings.filter(
				(listing) => listing.id !== listingId
			);
			setListings(updatedListings);
			toast.success('Listing successfully deleted');
		}
	};

	const onEdit = (listingId) => {
		navigate(`/edit-listing/${listingId}`);
	};

	return (
		<div className="profile">
			<header className="profileHeader">
				<p className="pageHeader">My Profile</p>
				<button className="logOut" type="button" onClick={onLogout}>
					Logout
				</button>
			</header>

			<main>
				<div className="profileDetailsHeader flex justify-between mt-5">
					<p className="profileDetailsText">Personal Details</p>
					<p
						className="changePersonalDetails"
						onClick={() => {
							changeDetails && onSubmit();
							setChangeDetails((prevState) => !prevState);
						}}
					>
						{changeDetails ? 'Done' : 'Change'}
					</p>
				</div>
				<div className="profileCard">
					<form>
						<input
							type="text"
							id="name"
							className={
								!changeDetails
									? 'profileName'
									: 'profileNameActive bg-gray-300'
							}
							disabled={!changeDetails}
							value={name}
							onChange={onChange}
						/>
						<input
							type="text"
							id="email"
							className={
								!changeDetails
									? 'profileEmail'
									: 'profileEmailActive'
							}
							disabled={!changeDetails}
							value={email}
							onChange={onChange}
						/>
					</form>
				</div>

				<Link to="/create-listing" className="createListing py-5">
					<img src={homeIcon} alt="Home" />
					<p>Sell or rent your home</p>
					<img src={arrowRight} alt="arrow right" />
				</Link>

				{!loading && listings?.length > 0 && (
					<>
						<p className="listingText">Your Listings</p>
						<ul className="listingsList">
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
									onEdit={() => onEdit(listing.id)}
									onDelete={() => onDelete(listing.id)}
								/>
							))}
						</ul>
					</>
				)}
			</main>
		</div>
	);
}

export default Profile;
