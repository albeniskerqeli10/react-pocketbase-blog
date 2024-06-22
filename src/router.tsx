import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
//@ts-nocheck
import { Suspense, lazy, FC } from 'react';
import ProtectedRoute from './routes/ProtectedRoute';
import Spinner from './components/UI/Spinner/Spinner';
import ErrorPage from './routes/ErrorPage';
import Skeleton from './components/UI/Skeleton/Skeleton';
// import fetchData from './utils/fetchData';
// import { getBlogs, getSingleBlog } from './services/blogAPI';
const Home = lazy(() => import('./routes/Home/Home'));
const SingleBlog = lazy(() => import('./routes/SingleBlog/SingleBlog'));
const CreateBlog = lazy(() => import('./routes/CreateBlog/CreateBlog'));
const Login = lazy(() => import('./routes/Login/Login'));
const SignUp = lazy(() => import('./routes/SignUp/SignUp'));
const Profile = lazy(() => import('./routes/Profile/Profile'));
const User = lazy(() => import('./routes/User/User'));
const NoAuthRoute = lazy(() => import('./routes/NoAuthRoute'));
const Search = lazy(() => import('./routes/Search/Search'));

// export const dd = cd.read();

const Router: FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        // loader={async ({}) => {
        //   await import('./routes/Home/Home');
        //   return [];
        // }}
        path='/'
        element={<Layout />}
        errorElement={<ErrorPage />}
      >
        <Route
          index
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                {/*@ts-ignore*/}
                <Home />
              </ProtectedRoute>
            </Suspense>
          }
          // loader={async () => {
          //   await import('./routes/Home/Home');
          //   return null;
          // }}
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
        <Route
          path='no-auth-route'
          element={
            <Suspense fallback={<Spinner />}>
              <NoAuthRoute />
            </Suspense>
          }
        />
        <Route
          path='create-blog'
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path='search'
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path='blog/:id'
          element={
            <Suspense fallback={<Skeleton width='100%' mainSkeletonHeight='400px' />}>
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
  return (
    <RouterProvider
      // future={{
      //   v7_startTransition: true,
      // }}
      router={router}
    />
  );
};
export default Router;
