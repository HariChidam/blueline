import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
//Pictures
import blueline from '../public/blueline.png';
import supabase from '../supabase.js';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
//other
import cookie from "js-cookie";
import {v4 as uuid} from 'uuid';


export default function Navbar() {

    const [user, setUser] = useState<User | null>(null);

    const handleAuthStateChange = (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      };
    
      useEffect(() => {
        const fetchSession = async () => {
          try {
            const session = await supabase.auth.getSession();
            if (session) {
              setUser(session.data.session?.user || null)
            }
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchSession();
        // Listen for changes in the authentication state
        const authListener = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            setUser(session.user);
          }
          if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        });
    
      }, []);
      
    
      const handleGoogleSignIn = async () => {
        const {data , error} = await supabase.auth.signInWithOAuth({provider: 'google'});
        console.log(error)
      }
    
      const handleGoogleSignOut = async () => {
        const {error} = await supabase.auth.signOut();
      }


  return (
    <div className='shadow-xl mb-8'>
        <div className="flex items-center w-full h-20 p-8">
            <h1 className="text-6xl text-blue-900 sm:text-7xl md:text-8xl font-bold">
                Blue
            </h1>
            <h1 className="text-6xl text-blue-500 sm:text-7xl md:text-8xl font-bold">
                Line
            </h1>
            <Image src={blueline} alt="Blue Line" className="h-20 w-20 ml-2" />
        </div>
        <hr className='h-1 mx-auto my-4 bg-gray-800 border-0 rounded md:my-10'></hr>
        <div className='flex flex-row items-center justify-between pb-4 mx-2'>
            <div className='flex flex-col items-center'>
                <div className=''>
                    {user ? (
                        <button
                        className="bg-blue-900 text-white font-bold p-2 rounded-lg shadow hover:scale-105 hover:shadow-lg"
                        onClick={handleGoogleSignOut}
                        >
                        Sign Out
                        </button>
                    ) : (
                        <button
                        className="bg-blue-900 text-white font-bold p-2 rounded-lg shadow hover:scale-105 hover:shadow-lg"
                        onClick={handleGoogleSignIn}
                        >
                        Sign In
                        </button>
                    )}
                </div>
            </div>
            <section className=''>
                <ul className="flex flex-row items-center justify-end">
                <li className="mx-1">
                    <Link legacyBehavior href="/">
                    <a className="text-blue-500 hover:text-blue-900 transition-colors duration-300 px-2 py-2 rounded-md text-lg ">Bars</a>
                    </Link>
                </li>
                <li className="mx-1">
                    <Link legacyBehavior href="/about">
                    <a className="text-blue-500 hover:text-blue-900 transition-colors duration-300 px-2 py-2 rounded-md text-lg">About</a>
                    
                    </Link>
                </li>
                <li className="mx-1">
                    <Link legacyBehavior href="/contactUs">
                    <a className="text-blue-500 hover:text-blue-900 transition-colors duration-300 px-2 py-2 rounded-md text-lg">Contact Us</a>
                    </Link>
                </li>
                </ul>
            </section>
        </div>
    </div>
  )
}
