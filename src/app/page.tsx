import Image from 'next/image'
import holdings from '../../pages/holdings'
import {setHolding} from '../../Firebase/config.js'

export default function Home() {
  setHolding()
  return (
    
    <div>
      hi
    </div>
  )
}
