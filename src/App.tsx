import HeartIcon from "./assets/heart.svg"
import GitHubIcon from "./assets/github.svg"

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

function App() {
  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <div>
        <Header />
        <p className="text-justify px-2 md:px-4 lg:px-8">
        An image compression tool reduces file size while preserving visual quality. It optimizes images to save storage, improve web performance, and decrease load times, making them efficient for sharing and use in apps.
        </p>
      </div>
      <Footer />
    </div>
  )
}

export default App
