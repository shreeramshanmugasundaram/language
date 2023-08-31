import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom/dist";

const AudioList = () => {
  const navigate = useNavigate();
  const [audioData, setAudioData] = useState([]);
  console.log(audioData);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAudioData = async (page) => {
    try {
      const response = await fetch(
        `/getAudio?page=${page}`,{
          method: "GET"
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching audio data:", error);
    }
  };

  const deleteAudio = async (id, filename) => {
    try {
      await fetch(`/deleteAudio/${id}`, {
        method: "DELETE",
      });
      await fetch(`/deleteFile/${filename}`, {
        method: "DELETE",
      });

      setAudioData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting audio:", error);
    }
  };

  const loadNextPage = async () => {
    const newData = await fetchAudioData(currentPage);
    if (newData.length > 0) {
      setAudioData((prevData) => [...prevData, ...newData]);
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      console.log("No more audio data available.");
    }
  };

  useEffect(() => {
    loadNextPage();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 py-6 w-full text-white text-center">
        <h1 className="text-3xl font-semibold tracking-wider">
          Audio List Dashboard
        </h1>
      </header>

      <div className="p-10">
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700"
          >
            Back to Recording
          </button>
        </div>
        <main className="container mx-auto">
          <ul className="space-y-6 grid grid-cols-6 space-x-2">
            {audioData.map((item, index) => (
              <li
                key={item._id}
                className="bg-white shadow-lg rounded-lg p-6 flex space-x-4"
              >
                <div className="flex-grow">
                  <audio controls className="w-full mb-2">
                    <source src={item.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <p className="text-lg mb-2 ">
                    <span className=" font-bold">Emotion</span>: {item.emotion}
                  </p>
                  <button
                    onClick={() => deleteAudio(item._id, item.filename)}
                    className="block w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>

        {audioData?.length > 0 && (
          <button
            onClick={loadNextPage}
            className="mt-8 mx-auto block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioList;
