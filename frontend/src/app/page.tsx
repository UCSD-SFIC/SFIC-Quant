import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-1xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://www.sficucsd.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/favicon.ico"
              alt="SFIC Logo"
              className="plain"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '-1000px' }}>
      <Link href="/holdings" passHref>
        <button className="text-4xl font-bold text-blue-900 mt-[-20px] hover:bg-blue-200 py-4 px-10 rounded-xl">
          Holdings</button>
      </Link>
      <Link href="/analytics" passHref>
        <button className="text-4xl font-bold text-blue-900 mt-[-20px] hover:bg-blue-200 py-4 px-10 rounded-xl">
          Analytics</button>
      </Link>
      <Link href="/members" passHref>
        <button className="text-4xl font-bold text-blue-900 mt-[-20px] hover:bg-blue-200 py-4 px-10 rounded-xl">
          Members</button>
      </Link>
      <Link href="/past-holdings" passHref>
        <button className="text-4xl font-bold text-blue-900 mt-[-20px] hover:bg-blue-200 py-4 px-10 rounded-xl">
          Past Holdings</button>
      </Link>
      </div>
    </main>
  )
}