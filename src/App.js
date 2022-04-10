import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from './firebase.init';

const auth = getAuth(app);

const App = () => {
	const [validated, setValidated] = useState(false)
	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [registered, setRegistered] = useState(false);
	const [password, setPassword] = useState('');

	const handleNameBlur = (e) => {
		setName(e.target.value);
	}


	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.value)
	}

	const handleRegisteredChange = (e) => {
		setRegistered(e.target.checked)
	}

	const handleFormSubmit = (e) => {
		e.preventDefault();
		//validation
		 const form = e.currentTarget;
		 if (form.checkValidity() === false) {
		 	e.stopPropagation();
			 return;
		 }

		 if (!/^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹]).*$/){
			 setError(error.message);
			 return;
		 }

		 setValidated(true);

		//conditional rendering
		if(registered) {
			signInWithEmailAndPassword(auth, email, password)
			.then(userCredentials => {
				const user = userCredentials.user;
				console.log(user)
			})
			.catch(error => {
				setError(error.message)
			})
		}
		else{
			createUserWithEmailAndPassword(auth, email, password)
				.then(result => {
					const user = result.user;
					console.log(user);
					setEmail('');
					setPassword('');
					verifyEmail();
					handleName();
				})
				.catch(error => {
					setError(error.message)
				})
		}
	}

	const handlePasswordReset = () => {
		sendPasswordResetEmail(auth, email)
		.then(() => {
			console.log('email sent')
		})
		.catch((error) => {
			setError(error.message)
		})
	}

	const handleName = () => {
		updateProfile(auth.currentUser, {
			displayName: name
		})
		.then(() => {
			console.log('updating name')
		})
		.catch(error => {
			setError(error.message)
		})
	}

	const verifyEmail = () => {
		sendEmailVerification(auth.currentUser)
		.then(() => {
			console.log('Email Verification Sent')
		})
	}


	return (
		<>
		<h1 className='text-3xl text-center text-red-700 my-6'>{registered ? 'Please Login!!' : 'Register!!'}</h1>
		<div className="w-full max-w-xs mx-auto">
			<form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				{!registered && <div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="username">
					UserName
				</label>
				<input onBlur={handleNameBlur} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="username" required/>
				</div>}
				<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="email">
					Email
				</label>
				<input onBlur={handleEmailChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="email" required/>
				</div>
				<div className="mb-6">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="password">
					Password
				</label>
				<input onBlur={handlePasswordChange} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" required/>
				<p className="text-red-500 text-xs italic">Please choose a password.</p>
				</div>
				<div className=" mb-6">
				<div className="md:w-1/3"></div>
				<label className="md:w-2/3 block text-gray-500 font-bold">
				<input onChange={handleRegisteredChange} className="mr-2 leading-tight" type="checkbox"/>
				<span className="text-sm">
					Already Registered?
				</span>
				</label>
				</div>
				<div className="flex items-center justify-between">
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
					{registered ? 'Login' : 'Register'}
				</button>
				<a onClick={handlePasswordReset} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
					Forgot Password?
				</a>
				</div>
			</form>
			<p className='text-center text-red-700 text-2xl mb-3'>{error}</p>
			<p className="text-center text-gray-500 text-xs">
				&copy;2020 Sundorima. All rights reserved.
			</p>
		</div>
		</>
	);
};

export default App;


