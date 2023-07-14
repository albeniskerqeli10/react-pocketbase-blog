import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { Suspense, lazy, FC } from 'react';
import ProtectedRoute from './routes/ProtectedRoute';
import Spinner from './components/Spinner/Spinner';
import FreeAccess from './routes/FreeAccess';
const Home = lazy(() => import('./routes/Home/Home'));
const SingleBlog = lazy(() => import('./routes/SingleBlog/SingleBlog'));
const Login = lazy(() => import('./routes/Login/Login'));
const SignUp = lazy(() => import('./routes/SignUp/SignUp'));
const Profile = lazy(() => import('./routes/Profile/Profile'));
import User from './routes/User/User';
const Router: FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path='login'
          element={
            <Suspense fallback={<Spinner />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path='signup'
          element={
            <Suspense fallback={<Spinner />}>
              <SignUp />
            </Suspense>
          }
        />
        <Route path='freeaccess' element={<FreeAccess />} />
        <Route
          path='blog/:id'
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <SingleBlog />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path='profile'
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path='user/:id'
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            </Suspense>
          }
        />
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};
export default Router;
