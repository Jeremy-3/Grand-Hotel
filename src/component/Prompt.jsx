import React from 'react'
import { Link } from 'react-router-dom';
const Prompt = ({children,isAuthenticated}) => {
    if (!isAuthenticated){
        return(
            <div className='bg-yellow-100 p-4 text-yellow-800'>
                <p>You need to log in to access this page. Please log in.</p>
                <Link to="/login" className="text-blue-600 underline">Log in</Link>
            </div>
        )

    }
    return children
}

export default Prompt