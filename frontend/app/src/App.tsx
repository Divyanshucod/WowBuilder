
import { useEffect, useState } from 'react'
import './App.css'
import { MainSection } from './components/MainSection'
import './index.css'
import { ThemeContext, type themeColor } from './components/Contexts'
import { approvedDark, approvedLight, conditionDark, conditionLight, declinedDark, declinedLight, gotoDark, gotoLight, moduleDark, moduleLight, reviewDark, reviewLight } from './components/UI/NodeUI'
export let styleMode = {...moduleLight}
export let styleCondition = {...conditionLight}
export let styleApprove = {...approvedLight}
export let styleDecline = {...declinedLight}
export let styleNeedsReview = {...reviewLight}
export let styleGOTO = {...gotoLight}
function App() {
  const [theme,setTheme] = useState<themeColor>('light')
  function toggleTheme() {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  useEffect(()=>{
    
      if(theme === "dark"){
          document.documentElement.classList.add("dark")
          styleApprove = {...approvedDark}
          styleCondition = {...conditionDark}
          styleDecline = {...declinedDark}
          styleNeedsReview = {...reviewDark}
          styleGOTO = {...gotoDark}
          styleMode = {...moduleDark}
      }else{
          document.documentElement.classList.remove("dark")
          styleApprove = {...approvedLight}
          styleCondition = {...conditionLight}
          styleDecline = {...declinedLight}
          styleNeedsReview = {...reviewLight}
          styleGOTO = {...gotoLight}
          styleMode = {...moduleLight}
      }
  },[theme])
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        <MainSection/>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
