import HeartIcon from "./assets/heart.svg"
import GitHubIcon from "./assets/github.svg"
import { useEffect, useState } from "react"


function Header() {
  return (
    <header className="bg-blue-200 w-full py-2 md:py-4 mb-4 flex flex-row justify-between px-4 md:px-6">
      <h1 className='font-bold text-2xl'>
        Image compressor
      </h1>
      <a href="https://github.com/Siddhesh-Agarwal/image-comp" target="_blank" rel="noreferrer" className='hover:bg-blue-300 py-1 px-2 rounded-md'>
        <img src={GitHubIcon} alt="GitHub" className='w-6 h-6' />
      </a>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-blue-200 text-center w-full py-4">
      <h1 className='font-bold'>
        Made by <a href="https://github.com/Siddhesh-Agarwal" target="_blank" rel="noreferrer" className='underline text-blue-600'>Siddhesh Agarwal</a> with <img src={HeartIcon} alt="Heart" className='w-4 h-4 inline' />
      </h1>
    </footer>
  )
}

function ProgressBar({ value, target }: { value: number, target: number }) {
  const percentage = (value / target) * 100;

  return (
    <div className="w-full max-w-2xl bg-gray-200 rounded-full h-4">
      <div
        className="bg-blue-600 h-4 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}


function App() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [filesProcessed, setFilesProcessed] = useState<number>(0);
  const [currentlyProcessing, setCurrentlyProcessing] = useState<string | null>(null);

  const processFiles = async (files: FileList | null) => {
    if (!files) {
      return;
    }
    const numOfFiles = files.length;
    const compressedFiles: File[] = [];
    for (let i = 0; i < numOfFiles; i++) {
      const file = files.item(i);
      if (file === null) {
        break;
      }
      setCurrentlyProcessing(file.name);
      try {
        compressImage(file)
          .then((compressedFile) => (compressedFiles[i] = compressedFile))
          .catch((err) => { console.error(err) });
        // Simulate saving or further processing the compressed image
        console.log(`Compressed image for ${file.name} is ready for further processing.`);

        setFilesProcessed((prev) => prev + 1);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
    setCurrentlyProcessing(null);
  }

  // A mock function to simulate image compression
  const compressImage = async (image: File): Promise<File> => {
    const oldFileSize = image.size;
    return new Promise((resolve, reject) => {
      if (!image.type.startsWith("image")) {
        reject("Only images are accepted")
      }
      if (!image.type.match(/(jpeg)|(jpg)|(png)/i)) {
        reject("Only PNG, JPG and JPEG are accepted")
      }

      // TODO: Compress image
    })
  }

  useEffect(() => { processFiles(files) }, [files])

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <div>
        <Header />
        <p className="text-justify px-2 md:px-4 lg:px-8">
          An image compression tool reduces file size while preserving visual quality. It optimizes images to save storage, improve web performance, and decrease load times, making them efficient for sharing and use in apps.
        </p>

        <div className="flex flex-col items-center justify-center w-full h-96">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full max-w-xl h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept=".png,.jpg,.jpeg" multiple onChange={(e) => setFiles(e.target.files)} />
          </label>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col items-center w-full">
          {currentlyProcessing && <p className="text-base">Processing {currentlyProcessing}...</p>}
          {files && <ProgressBar value={filesProcessed} target={files.length} />}
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default App
