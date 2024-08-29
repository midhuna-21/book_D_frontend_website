export interface userData{
   name:string
   email:string
   password?:string | null
   isBlocked?:boolean
   image?:string | string[]
   phone?:number
}

export class userProfile{
   name:string
   email:string
   password?:string | null
   phone?:number
   image?:string | string[]
   isBlocked?:boolean 
   constructor({name,email,password,phone,isBlocked,image}:userData){
      this.name = name
      this.email = email
      this.password = password
      this.phone = phone
      this.image = image
      this.isBlocked = isBlocked
   }
}