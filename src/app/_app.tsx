// SomeComponent.whyDidYouRender = true

import '@/utils/wdyr'
// глобальные стили
import '@/global.scss'
import { CacheProvider, EmotionCache } from '@emotion/react'
// сброс CSS
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { AppProps } from 'next/app'
import createEmotionCache from "@/src/utils/createEmotionCache";
// ...
import ErrorFallback from '@/components/ErrorFallback'
import Footer from '@/components/Footer'
import CustomHead from '@/components/Head'
import Header from '@/components/Header'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { ErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// настраиваем тему MUI
const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat, sans-serif'
    },
    components: {
        MuiListItem: {
            styleOverrides: {
                root: {
                    width: 'unset'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    flexGrow: 'unset'
                }
            }
        }
    }
})

// создаем клиентский кэш
const clientSideEmotionCache = createEmotionCache()

export default function App({
                                Component,
                                pageProps,
                                emotionCache = clientSideEmotionCache
                            }: AppProps & { emotionCache?: EmotionCache }) {
    // ссылка на анимируемый элемент
    const [animationParent] = useAutoAnimate()

    return (
        <>
            {/* провайдер кэша */}
            <CacheProvider value={emotionCache}>
                {/* провайдер темы */}
                <ThemeProvider theme={theme}>
                    {/* сброс стилей */}
                    <CssBaseline />
                    {/* компонент для добавления метаданных в `head` */}
                    <CustomHead
                        title='Default Title'
                        description='This is default description'
                    />
                    {/* предохранитель */}
                    <ErrorBoundary
                        // резервный компонент
                        FallbackComponent={ErrorFallback}
                        onReset={() => window.location.reload()}
                    >
                        <Container
                            maxWidth='xl'
                            sx={{
                                minHeight: '100vh',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                        >
                            <Header />
                            <Box component='main' flexGrow={1} ref={animationParent}>
                                {/* компонент страницы */}
                                <Component {...pageProps} />
                            </Box>
                            <Footer />
                        </Container>
                        {/* компонент уведомлений */}
                        <ToastContainer autoClose={2000} hideProgressBar theme='colored' />
                    </ErrorBoundary>
                </ThemeProvider>
            </CacheProvider>
        </>
    )
}