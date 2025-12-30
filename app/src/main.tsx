import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client/react'

import ProjectListContainer from './components/project/ProjectListContainer.tsx'
import ProjectDetailsContainer from './components/project/ProjectDetailsContainer.tsx'
import NotFoundRoute from './components/common/not-found-page/NotFoundRoute.tsx'
import { store } from './store/store.ts'
import { apolloClient } from './apollo-client.tsx'
import './index.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/projects" replace />,
        errorElement: <NotFoundRoute />,
    },
    {
        path: '/projects',
        element: <ProjectListContainer />,
        children: [
            {
                path: ':projectId',
                element: <ProjectDetailsContainer />,
            },
        ],
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={apolloClient}>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </ApolloProvider>
    </StrictMode>
)
