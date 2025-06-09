import HeartIcon from "./assets/heart.svg";
import GitHubIcon from "./assets/github.svg";
import { useCallback, useEffect, useState } from "react";
import JSZip from "jszip";

function Header() {
  return (
    <header className="bg-blue-200 w-full py-2 md:py-4 mb-4 flex flex-row justify-between px-4 md:px-6">
      <h1 className="font-bold text-2xl">Image compressor</h1>
      <a
        href="https://github.com/Siddhesh-Agarwal/image-comp"
        target="_blank"
        rel="noreferrer"
        className="hover:bg-blue-300 py-1 px-2 rounded-md"
      >
        <img src={GitHubIcon} alt="GitHub" className="w-6 h-6" />
      </a>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-blue-200 text-center w-full py-4 mt-4">
      <h1 className="font-bold">
        Made by{" "}
        <a
          href="https://github.com/Siddhesh-Agarwal"
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-600"
        >
          Siddhesh Agarwal
        </a>{" "}
        with <img src={HeartIcon} alt="Heart" className="w-4 h-4 inline" />
      </h1>
    </footer>
  );
}

function ImageCompressor() {
  const [files, setFiles] = useState<FileList>();
  const [filesProcessed, setFilesProcessed] = useState<number>(0);
  const [currentlyProcessing, setCurrentlyProcessing] = useState<string>("");
  const [zipFile, setZipFile] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const compressImage = useCallback(
    async (file: File, quality: number = 0.8): Promise<File> => {
      return new Promise((resolve, reject) => {
        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validTypes.includes(file.type.toLowerCase())) {
          reject(new Error("Invalid file type"));
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions (max 1920x1080 to reduce file size)
          const maxWidth = 1920;
          const maxHeight = 1080;
          let { width, height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.(png|jpg|jpeg)$/i, "_compressed.jpg"),
                  {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              } else {
                reject(new Error("Compression failed"));
              }
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const processFiles = useCallback(
    async (files: FileList) => {
      if (!files || files.length === 0) {
        return;
      }

      setIsProcessing(true);
      setFilesProcessed(0);
      setZipFile(null);

      const numOfFiles = files.length;
      const compressedFiles: File[] = [];

      for (let i = 0; i < numOfFiles; i++) {
        const file = files.item(i);
        if (file === null) {
          continue;
        }

        setCurrentlyProcessing(file.name);

        try {
          const compressedFile = await compressImage(file);
          compressedFiles.push(compressedFile);
          setFilesProcessed((prev) => prev + 1);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          // Continue processing other files even if one fails
        }
      }

      // Reset processing state
      setCurrentlyProcessing("");
      setIsProcessing(false);

      // Create ZIP file if we have compressed files
      if (compressedFiles.length > 0) {
        // Using a simple ZIP implementation since JSZip isn't available
        // For a real implementation, you'd want to use JSZip

        // For now, let's create a simple blob containing all files
        // In a real scenario, you'd use JSZip like this:

        // Temporary solution: create a blob with the first compressed file
        // Replace this with proper ZIP generation
        if (compressedFiles.length === 1) {
          setZipFile(compressedFiles[0]);
        } else {
          const zip = new JSZip();
          compressedFiles.forEach((file) => {
            zip.file(file.name, file);
          });
          const zipBlob = await zip.generateAsync({ type: "blob" });
          setZipFile(zipBlob);
        }
      }
    },
    [compressImage]
  );

  useEffect(() => {
    if (files) {
      processFiles(files);
    }
  }, [files, processFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    if (!files) {
      return;
    }
    setFiles(files);
    setFilesProcessed(0);
    setZipFile(null);
  };

  const downloadFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (zipFile) {
      const url = URL.createObjectURL(zipFile);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        files?.length === 1 ? "compressed_image.jpg" : "compressed_images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-96">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full max-w-xl h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-100 text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:dark:tetx-gray-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-inherit"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-inherit">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-inherit">PNG, JPG or JPEG</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg"
            multiple
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </label>
      </div>

      {/* Progress Bar */}
      {files && (
        <div className="flex flex-col items-center w-full">
          <progress
            value={filesProcessed}
            max={files?.length}
            className="w-full max-w-2xl rounded-xl"
          >
            <div className="text-center">
              {isProcessing ? (
                <p className="text-sm text-gray-600 mb-2">
                  Processing: {currentlyProcessing} ({filesProcessed}/
                  {files.length})
                </p>
              ) : (
                <p className="text-sm text-green-600 mb-2">
                  ✓ Processed {filesProcessed} of {files.length} files
                </p>
              )}
            </div>
          </progress>
          {zipFile && !isProcessing && (
            <button
              onClick={downloadFile}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mt-4"
            >
              Download Compressed {files.length > 1 ? "Images" : "Image"}
            </button>
          )}
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        <p className="text-justify px-2 md:px-4 lg:px-8">
          An image compression tool reduces file size while preserving visual
          quality. It optimizes images to save storage, improve web performance,
          and decrease load times, making them efficient for sharing and use in
          apps.
        </p>
        <ImageCompressor />
      </div>
      <Footer />
    </div>
  );
}

export default App;
