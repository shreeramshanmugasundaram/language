import React from 'react'

const Intro = () => {
  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
            <section className="py-14">
                <div className="max-w-screen-xl mx-auto px-4 md:text-center md:px-8">
                    <div className="max-w-3xl md:mx-auto">
                        <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                        Multilingual Speech Emotion Recognition System for Indian Languages
                        </h3>
                        <p className="mt-4 text-gray-600 ">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.
                        </p>
                    </div>
                    <div className="flex gap-3 items-center mt-6 md:justify-center">
                        <a href="/collect" className="inline-block py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-lg shadow-md hover:shadow-none">
                            Get started
                        </a>
                        <a href="/audiolist" className="inline-block py-2 px-4 text-gray-800 font-medium duration-150 border hover:bg-gray-50 active:bg-gray-100 rounded-lg">
                            Collected Samples
                        </a>
                    </div>
                </div>
            </section>
    </div>
        )
}

export default Intro
