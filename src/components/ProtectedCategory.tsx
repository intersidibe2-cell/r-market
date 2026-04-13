import { ReactNode, useState } from 'react'
import { useAdultAccess } from '../context/AdultAccessContext'
import AgeGate from './AgeGate'

interface ProtectedCategoryProps {
  children: ReactNode
}

export default function ProtectedCategory({ children }: ProtectedCategoryProps) {
  const { hasAccess } = useAdultAccess()
  const [showGate, setShowGate] = useState(!hasAccess)

  if (!hasAccess || showGate) {
    return (
      <>
        {showGate && (
          <AgeGate 
            onVerified={() => setShowGate(false)}
            onCancel={() => window.history.back()}
          />
        )}
        {!showGate && hasAccess && children}
      </>
    )
  }

  return <>{children}</>
}
