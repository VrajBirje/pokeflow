import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
    return (
        <div className='flex flex-col items-center justify-center h-[100vh]'>
            <SignIn />
        </div>
    );
};

export default SignInPage;
