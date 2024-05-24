
import { useContext } from "react";
import { ButtonContext } from "../context/BoutonProvider";
function Button2 () {
    const{ buttonClicked, setButtonClicked} = useContext(ButtonContext)
    return (
        <div>
            <button onClick={function(){
            setButtonClicked(buttonClicked -1)
            if (buttonClicked === 0){
                setButtonClicked(0)
            }
            }}>👎</button>
            
        </div>
    )
}

export default Button2;