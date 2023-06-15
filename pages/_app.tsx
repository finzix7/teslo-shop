import { AuthProvider, CartProvider, UiProvider } from '@component/context'
import '@component/styles/globals.css'
import { lightTheme } from '@component/themes'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
        <SWRConfig
          value={{
            //refreshInterval: 500,
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >

          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>

        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}
