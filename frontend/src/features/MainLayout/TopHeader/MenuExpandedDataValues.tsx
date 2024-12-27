import Cookies from "js-cookie"

export default [`../Profile/${Cookies.get("authorID")}`, "../Settings", "../Welcome"];
