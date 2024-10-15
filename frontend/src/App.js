import React, {useEffect, useState} from 'react'

function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return(
    <div>
      {(typeof backendData.tickets == 'undefined') ? (
        <p>Loading...</p>
      ):(
        backendData.tickets.map((ticket, i) => (
          <p key={i}>{ticket}</p>
        ))
      )}
    </div>
  )
}

export default App