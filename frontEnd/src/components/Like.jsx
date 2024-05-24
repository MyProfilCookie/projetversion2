import { useContext } from "react";
import { ButtonContext } from "../context/BoutonProvider";
function Button () {
    const{ buttonClicked, setButtonClicked} = useContext(ButtonContext)
    return (
        <div>
            <button onClick={function(){
            setButtonClicked(buttonClicked +1)
            }}>👍</button>
            
        </div>
    )
}

export default Button;