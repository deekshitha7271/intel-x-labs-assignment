import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
//clsx:
//A library that helps conditionally join class names.
// ClassValue:
// Type provided by clsx.
// Defines what types of values you can pass to clsx (strings, objects, arrays, conditionals, etc.).
// tailwind-merge (twMerge):
// Special function that intelligently merges Tailwind classes so you don’t get conflicts.


//convert prisma object into regular js objects

export function convertToPlainObject<T>(value:T):T{
  return JSON.parse(JSON.stringify(value));

}

//Format numbeer with decimal places

export function formatNumberWithDecimal(num:number):string{
  const [int,decimal]=num.toString().split('.');
  return decimal?`${int}.${decimal.padEnd(2,'0')}`:`${int}.00`;
  
}

//Format errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error:any){
  if(error.name==='ZodError'){
    //Handle Zod Error
    //const fieldErrors=Object.keys(error.issues).map((field)=>error.issues[field].message);
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldErrors = error.issues.map((issue: any) => issue.message);

    return fieldErrors.join('. ');
  }else if(error.name==='PrismaClientKnownRequestError' && error.code==='P2002'){
    //Handle Prisma Error
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase()+field.slice(1)} already exists`
  }
  else{
    //Handle other errors
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
}

//Round number to 2 decimal places
export function round2(value:number | string){
  if(typeof value==='number'){
    return Math.round((value+Number.EPSILON)*100)/100;//ex:12.345*100=1234.5=>1235/100=12.35
    
  }else if(typeof value==='string'){
    return Math.round((Number(value)+Number.EPSILON)*100)/100;


  }else{
    throw new Error('Value is not a number or a string')
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-IN',{
  style:"currency",
  currency:"INR",
  minimumFractionDigits:3
});

//Format currency using the formatter above
export function formatCurrency(amount:number|string|null){
  if(typeof amount==="number"){
    return CURRENCY_FORMATTER.format(amount);
  }
  else if(typeof amount==="string"){
    return CURRENCY_FORMATTER.format(Number(amount));

  }
  else{
    return 'NaN';
  }
}