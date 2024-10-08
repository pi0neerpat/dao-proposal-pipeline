import { ethers } from 'ethers'

const convertTokensToThousandsK = (amountStr: string): string => {
  // Parse the string to a BigNumber
  const amount = ethers.BigNumber.from(amountStr)

  // Convert the BigNumber to a string in ether units
  const amountInEther = ethers.utils.formatUnits(amount, 18)

  // Parse the string to a float for further processing
  const amountFloat = parseFloat(amountInEther)

  // Format the number with 'k' for thousands
  if (amountFloat >= 1000) {
    return (amountFloat / 1000).toFixed(1) + 'k'
  }

  return amountFloat.toString()
}

export default convertTokensToThousandsK
