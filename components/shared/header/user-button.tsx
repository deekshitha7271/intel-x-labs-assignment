import Link from "next/link";
import { auth } from "@/auth";//to know if user is logged in or not
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

const UserButton = async() => {
    const session=await auth();
    if(!session){
        return (
            <Button asChild>
                <Link href='/sign-in'>
                <UserIcon/>Sign In
                </Link>
            </Button>
        )
    }
    const firstInitial=session.user?.name?.charAt(0).toUpperCase() ?? 'U';
    return ( 
    <div className="flex gap-2 items-center">
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button variant='ghost' className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200">
                {firstInitial}
            </Button>
            </div>  

        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium leading-none">
                        {session.user?.name}
                    </div>
                    <div className="text-sm text-muted-foreground leading-none">
                        {session.user?.email}
                    </div>
                </div>
            </DropdownMenuLabel>
                <DropdownMenuItem className="p-0 mb-1">
                    <form action={signOutUser} className="w-full">
                        <Button className="w-full py-4 px-2 h-4 justify-start" variant='ghost'>
                            Sign Out
                        </Button>

                    </form>
                </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu> 

    </div> );
}
 
export default UserButton;
//sfc


/**next/link → client-side navigation.

auth → custom wrapper around NextAuth’s session fetcher, tells if a user is logged in.

signOutUser → a server action you’ve written to log out.

Button → custom UI button (probably styled with Tailwind/shadcn).

DropdownMenu... → dropdown menu primitives from shadcn/ui.

UserIcon → icon from lucide-react.Notice: UserButton is an async Server Component (since you directly await inside).

auth() runs on the server during SSR to get the current session (null if not logged in).
If no session:

Renders a button that is actually a link (Button asChild passes styles to Link).

Inside: UserIcon + text “Sign In”.

Clicking takes user to /sign-in.

Flow: Unauthenticated users → see Sign In button.
If user has a name:

Grab first letter → uppercase → A for Alice.

If no name:

Fallback to 'U'. 

DropdownMenu is the container.

DropdownMenuTrigger: the button that opens the menu.

Inside: your circular ghost button showing the user’s initial (like an avatar).

Flow: Clicking this button opens the dropdown.
The dropdown opens to the right end (align='end').

Shows a label area with:

User’s name.

User’s email in muted/grey text.

Inside dropdown: one menu item.

It’s actually a <form> using Next.js Server Action:

When clicked, it submits to signOutUser.

That will destroy the session in the backend and redirect (or refresh UI).

Button styled as “Sign Out”.

Ends the dropdown and wrapper div.

Flow Execution Summary

Page loads → UserButton runs on the server.

auth() checks session:

No session → show Sign In button.

Session → show dropdown with user avatar.

User clicks avatar → dropdown opens.

Dropdown shows name + email.

User clicks “Sign Out” → form posts to signOutUser → session cleared → next reload will show Sign In button again.*/