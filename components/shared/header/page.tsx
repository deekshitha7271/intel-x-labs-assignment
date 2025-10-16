import Image from 'next/image'
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
const Header = () => {
    return <header className='w-full border-b bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm'>
        {/* Top Gradient Bar */}
        {/*<div className="h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"></div>*/}

        <div className='wrapper flex-between'>
            <div className="flex-start">
                <Link href="/" className='flex-start'>
                <Image src='/images/logo.jpg' alt={`${APP_NAME} logo`} height={48} width={48} priority={true} className='rounded-full ring-2 ring-pink-400 hover:scale-110 transition-transform duration-300'/>
                <span className='hidden lg:block font-bold text-2xl ml-3 bg-gradient-to-r from-rose-500 via-purple-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md hover:drop-shadow-lg transition-all duration-300'>
                    {APP_NAME}
                </span>
                </Link>
            </div>
            <Menu/>
        </div>

        </header>;
}
 
export default Header;