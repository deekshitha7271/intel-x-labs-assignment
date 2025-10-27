'use client'

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState, useEffect} from "react";
//Static target date (replace with desired date)

const TARGET_DATE = new Date('2025-10-28T00:00:00');

//Function to calculate the time remaining
const calculateTimeRemaining = (targetDate:Date)=>{
    const currentTime = new Date();
    const timeDifference = Math.max(Number(targetDate)-Number(currentTime),0);
    return {
        days:Math.floor(timeDifference / (1000*60*60*24)),
        hours:Math.floor(
            (timeDifference%(1000*60*60*24))/(1000*60*60)
        ),
        minutes:Math.floor(
            (timeDifference%(1000*60*60))/(1000*60)
        ),
        seconds:Math.floor(
            (timeDifference%(1000*60))/(1000)
        ),


    };

}

const DealCountdown = () => {
    const [time,setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

    useEffect(()=>{
       //Calculate initial time on client
       setTime(calculateTimeRemaining(TARGET_DATE));

       const timerInterval = setInterval(()=>{
        const newTime = calculateTimeRemaining(TARGET_DATE);
        setTime(newTime);

        if(newTime.days===0 && newTime.hours===0 && newTime.minutes===0 && newTime.seconds===0){
            clearInterval(timerInterval)
        }
        
       },1000);
       return ()=>clearInterval(timerInterval);
    },[])

    if(!time){
        return(
            <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
            <h3 className="text-3xl font-bold">
                Loading Countdown...
            </h3>
            </div>
            </section>
            )

        
    }

    return (<section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
            <h3 className="text-3xl font-bold">
                Deal of The Month
            </h3>
            <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border border-amber-300 text-amber-900 rounded-xl py-4 px-6 text-center shadow-md">
      <h2 className="text-xl md:text-2xl font-extrabold text-amber-800">
        🎉🌼 Diwali Special Offer 🌼🎉
      </h2>
      <p className="mt-2 text-base md:text-lg">
        Celebrate the victory of good over evil with{" "}
        <span className="font-bold text-orange-600">Flat 30% OFF</span> on all
        products! 🏹✨ Let the festive spirit bring joy to your shopping 🛍️
      </p>
    </div>
             
            <ul className="grid grid-cols-4">
                <StatBox label="Days" value={time.days}/>
                <StatBox label="Hours" value={time.hours}/>
                <StatBox label="Minutes" value={time.minutes}/>
                <StatBox label="Seconds" value={time.seconds}/>
            </ul>
            <div className="text-center">
                <Button asChild>
                    <Link href='/search'>
                    View Products
                    </Link>
                </Button>
            </div>

        </div>
        <div className="flex justify-center">
            <Image src="/images/promo.jpeg" alt='promotion' width={300} height={200}/>
        </div>
    </section> );
}


const StatBox = ({label,value}:{label:string;value:number;}) => (
    <li className="p-4 w-full text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p>{label}</p>
    </li>
)
 
export default DealCountdown;