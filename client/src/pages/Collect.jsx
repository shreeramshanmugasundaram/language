import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
const Collect = () => {
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let stream = null;
    let recorder = null;

    const startRecording = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);

        recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        const chunks = [];
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          setAudioBlob(audioBlob);
        };

        recorder.start();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    if (recording) {
      startRecording();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (recorder) {
        recorder.stop();
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recording]);

  const handleStartClick = () => {
    setRecording(true);
  };

  const handleStopClick = () => {
    setRecording(false);
  };

  const handleEmotionChange = (event) => {
    setEmotion(event.target.value);
  };

  const handleSubmit = async () => {
    if (audioBlob && emotion && !submitting) {
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.wav");
        formData.append("emotion", emotion);

        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("API call successful");
          const notify = () => toast.success('Successfully Collected!');
          notify()
        } else {
          console.error("API call failed");
        }
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        setSubmitting(false);
      }

      setAudioBlob(null);
      setEmotion("");
    }
  };
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
            <Toaster />
      <div className="p-8 rounded-md border-2">
        <div className="mb-10">
          <h2 className=" text-2xl font-medium text-gray-900">
            Record your Audio Sample
          </h2>
          <p className=" text-xs font-normal text-gray-600 mt-1">
            the auido sample is called for traing the model
          </p>
        </div>

        <div>

{
  recording &&
  <button disabled type="button" class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Recording... 
</button>
}

          {audioBlob && !recording && (
            <audio
              className="mb-8"
              controls
              src={URL.createObjectURL(audioBlob)}
            /> 
          )}
        </div>
        <div className=" space-x-6 mt-4">
          <button
            className="inline-block py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-lg shadow-md hover:shadow-none"
            onClick={handleStartClick}
            disabled={recording}
          >
            Start Recording
          </button>
          <button
            className="inline-block py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-lg shadow-md hover:shadow-none"
            onClick={handleStopClick}
            disabled={!recording}
          >
            Stop Recording
          </button>
        </div>

        <input
          className=" text-black px-4 py-2 mt-6 mb-4 border-2  w-full"
          type="text"
          placeholder="Enter your emotion"
          value={emotion}
          onChange={handleEmotionChange}
        />

        <button
          className=" bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-800 w-full disabled:bg-slate-400 "
          onClick={handleSubmit}
          disabled={!audioBlob || !emotion || submitting}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Collect;
