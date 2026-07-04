import  Project   from '../models/project.js'
   export  const   createProject = async(projectData) =>{
     return await  Project.create(projectData)
   }
    export  const getProject =  async (ownerId) =>{
         return await 
          Project.find({ owner:
             ownerId
          }).sort({
             createdAt: -1
          })
    }
     export  const getProjectById = async(id  , ownerId) => {
         return await Project.findOne({
             _id:id,
              owner:ownerId
         })

     }
      export  const UpdateProject = async (
         id, 
         ownerId, 
         updates
      ) =>{
         return await 
          Projct.findAndUpdate({ 
             _id:id, 
              owner:ownerId, 
          } , 
           updates
            {new:true}
        )
      }
       export  const  deleteProject  =  async (
         id, 
          ownerId
       ) => {
         return await 
          Project.findOneAndDelete({
             _id :id,
              owner :ownerId, 
          })
       }