'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";//constants to prefill inputs for dev/testing.
import { Button } from "@/components/ui/button";
import  Link  from "next/link";
import { useFormStatus } from "react-dom";//reads the form’s submission status (gives pending).Why: to disable button and show “signing in...” while submission is in flight.
import { useActionState } from "react";
//returns [data, action] bound to a server action.//Why: it wires your server action to the form and gives you the action result state.
import { signUpUser } from "@/lib/actions/user.actions";//the server action that performs authentication on submit.
import { useSearchParams } from "next/navigation";//to read callbackUrl from the page URL.
//Why: allow redirect destination to be passed through the sign-in flow.
const SignUpForm = () => {
    /**action is a function you assign to <form action={action}>. When the form submits, React converts the form into a FormData and calls the server action.

data holds the server action’s response (initially your { success:false, message:'' }).

Why: avoids manual fetch/XHR; keeps form semantics and gives you the server response in data.* */

    const [data, action] = useActionState(signUpUser,{
        success:false,
        message:''
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    /**Pulls callbackUrl so it can be sent to the server action as part of the form data (hidden input). */


    const SignUpButton=()=>{
        const {pending}=useFormStatus();
        /**useFormStatus() provides pending while the form submission is in progress.

Why: instant UX feedback and prevents double submits. */

        return(
            <Button disabled={pending} className="w-full" variant='default'>
                    {pending?'Submitting':'Sign Up '}
            </Button>
        )

    }


    return (
         <form action={action}>
        <input type="hidden"name="callbackUrl" value={callbackUrl}/>
       <div className="space-y-6">
        <div>
            <div>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' name='name' type='text'  autoComplete="name" defaultValue={signUpDefaultValues.name}/>
            </div>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='text'  autoComplete="email" defaultValue={signUpDefaultValues.email}/>
            </div>
            <div>
            <Label htmlFor='password'>password</Label>
            <Input id='password' name='password' type='password' required autoComplete="password" defaultValue={signUpDefaultValues.password}/>
            </div>
            <div>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input id='confirmPassword' name='confirmPassword' type='password' required autoComplete="confirmPassword" defaultValue={signUpDefaultValues.confirmPassword}/>
            </div>
            <div>
               <SignUpButton/>
            </div>

            {data&&!data.success&&(
                <div className="text-center text-destructive">
                    {data.message}
                </div>
            )}
            <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href='/sign-in' target='_self' className='link'>
                Sign In
                </Link>
            </div>
            </div> 

    </form>);
}
 
export default SignUpForm;

/**How the submission flow actually runs (runtime sequence)

User clicks the button. Browser validates required fields.

React/Next intercepts submit and calls the action function. The form becomes FormData and is sent to the server action (signInWithCredentials).

useFormStatus flips pending = true → button disables + text becomes “signing In…”.

Server action runs (checks DB, compares password, etc.) and returns an object (your data shape, e.g. { success: true/false, message: '...' }).

useActionState updates data on the client with that response.

UI reacts: if !data.success the error message area renders data.message. If data.success you could trigger a redirect (not in this snippet).

The error-display logic
{data && !data.success && (
  <div className="text-center text-destructive">{data.message}</div>
)}


Shows server-provided error messages after a failed signin attempt.

Why: server-level validation/errors (bad password, no user found) should be surfaced to the user.

Export
export default CredentialsSignInForm;


Exposes the component to be used inside pages. */