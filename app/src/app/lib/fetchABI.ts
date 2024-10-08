const fetchABI = async (contractAddress: string): Promise<any> => {
  const url = `https://api.arbiscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ARBISCAN_API_KEY}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error fetching ABI: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    if (data.status === '1') {
      return data.result
    } else {
      console.error('Failed to fetch ABI:', data.message)
    }
  } catch (error) {
    console.error('Error fetching ABI:', error)
  }
}

export default fetchABI
