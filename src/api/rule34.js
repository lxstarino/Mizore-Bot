const TYPES = [
    ".mp4",
    ".gif",
    ".jpg",
    ".jpeg",
    ".png"
]

class rule34{
    /**
     * Creates an instance of rule34
     * 
     * @param {string} baseURL 
     */

    constructor(baseURL = "https://api.rule34.xxx"){
        this.baseURL = baseURL;
    }

    /**
     * @param {string} URL  
     * @returns json data
     */

    async getData(URL){
        const response = await fetch(URL)
            .then(response => response.json())
            .catch(() => {
                throw "Failed to fetch response"
            })
        return(response)
    }

    /**
     * @param {string} tag 
     * @param {int} page_amount
     * @param {int} image_amount 
     * @param {string} filter 
     * @returns list
     */

    async getImages(tag, page_amount, image_amount, filter){
        if(!tag) throw "Empty Tag, Provide a tag"
        if(!page_amount || isNaN(page_amount)) throw "Invalid Page Amount - Provide a valid amount"
        if(!image_amount || isNaN(image_amount)) throw "Invalid Image amount - Provide a valid amount"

        const imgurl_list = []
        for(let i = 0; i < page_amount; i++){
            const page = await this.getData(`${this.baseURL}/index.php?page=dapi&s=post&q=index&limit=100&json=1&pid=${i}&tags=${tag}`)
            if(page.length == 0) break;
            page.forEach(img => {
                imgurl_list.push(`${img.file_url}`)
            })
        }
        
        const url_list = []
        if(filter != undefined){
            const filtered_images = await this.filter(imgurl_list, filter)

            for(let i = 0; image_amount > i; i++){
                url_list.push(`${filtered_images[Math.floor(Math.random() * filtered_images.length)]}`)
            }
            return(url_list)
        } else {
            for(let i = 0; image_amount > i; i++){
                url_list.push(`${imgurl_list[Math.floor(Math.random() * imgurl_list.length)]}`)
            }
            return(url_list)
        }
    }

    /**
     * 
     * @param {list} imglist 
     * @param {string} filter
     * @returns list
     */
    
    async filter(imglist, filter){
        if(!TYPES.includes(filter)) throw `Invalid Filter - Please provide a valid filter\nValid Filters: "${TYPES.join('", "')}"`

        const filtered_data = []
        imglist.forEach(img => {
            if(img.endsWith(filter)){
                filtered_data.push(img)
            }
        })
        
        if(filtered_data.length == 0) throw "No images found"
        return(filtered_data)
    }
}

module.exports = rule34;
