import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'

const styles: { root: CSSProperties } = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
}

const NotFoundRoute = () => {
    return (
        <div style={styles.root}>
            404 - Page not found
            <Link to="/">Go to home</Link>
        </div>
    )
}

export default NotFoundRoute
