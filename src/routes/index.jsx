import React, { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import AdminLayout from '../helpers/layout/AdminLayout';
import PrivateRoute from './PrivateRoute';
import GlobalLoader from '../helpers/loading/GlobalLoader';

// ── Lazy page imports ──────────────────────────────────────────
const Login      = React.lazy(() => import('../pages/auth/Login'));
const SignUp     = React.lazy(() => import('../pages/auth/SignUp'));
const Dashboard  = React.lazy(() => import('../pages/Dashboard'));
const Bookings   = React.lazy(() => import('../pages/Bookings'));
const Activities = React.lazy(() => import('../pages/Activities'));
const Slots      = React.lazy(() => import('../pages/Slots'));
const Users      = React.lazy(() => import('../pages/Users'));
const Payments   = React.lazy(() => import('../pages/Payments'));
const Settings   = React.lazy(() => import('../pages/Settings'));
const Profile    = React.lazy(() => import('../pages/Profile'));

// ── Suspense wrapper using GlobalLoader ───────────────────────
const LC = (Component) => (
  <Suspense fallback={<GlobalLoader />}>
    <Component />
  </Suspense>
);

// ── Route config ───────────────────────────────────────────────
const AllRoutes = () =>
  useRoutes([
    // Root → login
    { path: '/', element: <Navigate to="/admin/login" replace /> },

    // Auth routes (public)
    { path: '/admin/login',  element: LC(Login)  },
    { path: '/admin/signup', element: LC(SignUp) },

    // Protected admin routes
    {
      path: '/admin',
      element: <PrivateRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true,          element: <Navigate to="dashboard" replace /> },
            { path: 'dashboard',    element: LC(Dashboard)  },
            { path: 'bookings',     element: LC(Bookings)   },
            { path: 'activities',   element: LC(Activities) },
            { path: 'slots',        element: LC(Slots)      },
            { path: 'users',        element: LC(Users)      },
            { path: 'payments',     element: LC(Payments)   },
            { path: 'settings',     element: LC(Settings)   },
            { path: 'profile',      element: LC(Profile)    },
          ],
        },
      ],
    },

    // Catch-all → login
    { path: '*', element: <Navigate to="/admin/login" replace /> },
  ]);

export { AllRoutes };
