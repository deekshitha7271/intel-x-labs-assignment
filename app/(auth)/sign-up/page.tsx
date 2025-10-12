import { Metadata } from "next";
import {Card, CardContent, CardDescription, CardHeader,CardTitle} from '@/components/ui/card'
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import SignUpForm from "./sign-up-form";
import { auth } from "@/auth";//it is used to get session and see if we logged in or not
import { redirect } from "next/navigation";
export const metadata: Metadata={
    title: 'Sign Up'
}

const SignUpPage =async(props:{
    searchParams: Promise<{
        callbackUrl: string
    }>
}) => {
    const {callbackUrl}=await props.searchParams;

    const session = await auth();//to get the session in server component
    if(session){
        return redirect(callbackUrl ||'/')
    }

    return (<div className="w-full max-w-md mx-auto">
        <Card>
            <CardHeader className="space-y-4">
                <Link href="/" className='flex-center'>
                <Image src="/images/logo.jpg" width={100} height={100} alt={`${APP_NAME} logo`} priority={true}/>
                </Link>
                <CardTitle className="text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                    Enter your information below to sign up
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <SignUpForm/>
            </CardContent>
        </Card>
    </div>);
}
 
export default SignUpPage;


/**Big Picture

The goal: If a user came from a protected page (say /dashboard), and got redirected to login, we want them to go back where they came from after a successful sign in.

That’s what callbackUrl is: the "return path".

1. SignInPage (Server Component)
const SignInPage = async (props: {
  searchParams: Promise<{ callbackUrl: string }>
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth(); 
  if (session) {
    return redirect(callbackUrl || '/');
  }


Flow here:

The page reads the query param callbackUrl from the URL (e.g. /sign-in?callbackUrl=/dashboard).

Calls auth() to see if the user is already logged in.

If yes → immediately redirect(callbackUrl || '/').

Meaning: if callbackUrl exists, go there. Else, just go home /.

If no session, it renders the <CredentialsSignInForm />.

2. CredentialsSignInForm (Client Component)
<form action={action}>
  <input type="hidden" name="callbackUrl" value={callbackUrl}/>


It grabs callbackUrl again using useSearchParams().

It includes it as a hidden input so the form submission sends it to the server action.

Example submission payload →

{
  "email": "a@b.com",
  "password": "secret",
  "callbackUrl": "/dashboard"
}

3. Server Action: signInWithCredentials
export async function signInWithCredentials(prevState, formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const callbackUrl = formData.get('callbackUrl') // passed from hidden input

  const user = await db.user.findUnique({ where: { email } })

  if (!user || !bcrypt.compare(password, user.password)) {
    return { success: false, message: 'Invalid credentials' }
  }

  await signIn('credentials', { email, password, redirect: false })

  return { success: true, message: 'Signed in successfully', callbackUrl }
}


Notice: the server action returns callbackUrl along with success.

If login fails → { success:false, message }.

If login succeeds → { success:true, callbackUrl }.

4. Client reacts with useActionState
const [data, action] = useActionState(signInWithCredentials, {
  success: false,
  message: ''
});


When form is submitted:

React turns form → FormData

Calls the server action

Updates data with the response

So after success, data will look like:

{ success: true, message: 'Signed in successfully', callbackUrl: '/dashboard' }
 */