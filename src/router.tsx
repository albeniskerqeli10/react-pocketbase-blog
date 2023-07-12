import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { Suspense, lazy, FC } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/shared/Spinner';
import FreeAccess from './views/FreeAccess';
const Home = lazy(() => import('./views/Home/Home'));
const SingleBlog = lazy(() => import('./views/SingleBlog/SingleBlog'));
const Login = lazy(() => import('./views/Login/Login'));
const SignUp = lazy(() => import('./views/SignUp/SignUp'));

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
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};
export default Router;
