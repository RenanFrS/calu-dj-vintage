import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/logo/logo-calu.png"
        alt="Calu DJ"
        style={{
          maxHeight: '60px',
          width: 'auto',
        }}
      />
    </div>
  )
}
