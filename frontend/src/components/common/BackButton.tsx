import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
const BackNavigation = ({}) => {
    return (
        <Link href="/mainpage" className="ml-2">
            <ArrowBackIcon />
        </Link>
    );
};

export default BackNavigation;
