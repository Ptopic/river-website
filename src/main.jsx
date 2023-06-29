import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Pages
import Home from './Pages/Home.jsx';
import Menu from './Pages/Menu';
import Vine from './Pages/Vine';
import ErrorPage from './Pages/ErrorPage';
const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		errorElement: <ErrorPage />,
	},
	{
		path: 'menu',
		element: <Menu />,
		errorElement: <ErrorPage />,
	},
	{
		path: 'vine',
		element: <Vine />,
		errorElement: <ErrorPage />,
	},
]);
ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
