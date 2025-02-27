import HeartIcon from "./assets/heart.svg"
import GitHubIcon from "./assets/github.svg"
import { useEffect, useState } from "react"
import JSZip, { } from "jszip"


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
    <footer className="bg-blue-200 text-center w-full py-4 mt-4">
      <h1 className='font-bold'>
        Made by <a href="https://github.com/Siddhesh-Agarwal" target="_blank" rel="noreferrer" className='underline text-blue-600'>Siddhesh Agarwal</a> with <img src={HeartIcon} alt="Heart" className='w-4 h-4 inline' />
      </h1>
    </footer>
  )
}


function App() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [filesProcessed, setFilesProcessed] = useState<number>(0);
  const [currentlyProcessing, setCurrentlyProcessing] = useState<string | null>(null);
  const [zipFile, setZipFile] = useState<Blob | null>(null);

  async function processFiles(files: FileList | null) {
    if (!files) {
      return;
    }
    const numOfFiles = files.length;
    let compressedFiles: File[] = [];
    for (let i = 0; i < numOfFiles; i++) {
      const file = files.item(i);
      if (file === null) {
        break;
      }
      setCurrentlyProcessing(file.name);
      try {
        compressedFiles[i] = compressImage(file);
        setFilesProcessed((prev) => prev + 1);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
    // Reset the state
    setCurrentlyProcessing(null);
    // Filter out the null values
    compressedFiles = compressedFiles.filter((file) => file !== null);
    // convert the array to a zip file
    const zip = new JSZip();
    compressedFiles.forEach((file) => {
      zip.file(file.name, file);
    });
    // Generate the zip file
    setZipFile(await zip.generateAsync({ type: "blob" }));
  }

  // A mock function to simulate image compression
  function compressImage(file: File): File {
    // check if the file is an image
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    // TODO: image compression
    const compressedFileBlob = file; // update the logic
    const compressedFileOptions: FilePropertyBag = { type: file.type, lastModified: file.lastModified };
    const compressedFile = new File([compressedFileBlob], file.name, compressedFileOptions);
    return compressedFile;
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
          {
            files && (
              <progress value={filesProcessed} max={files.length} className="w-full max-w-2xl rounded">
                Processing {currentlyProcessing} ({filesProcessed}/{files.length})...
              </progress>
            )
          }
          {
            zipFile && (
              <a href={URL.createObjectURL(zipFile)} download="compressed_images.zip" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
                Download Compressed Images
              </a>
            )
          }
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default App
