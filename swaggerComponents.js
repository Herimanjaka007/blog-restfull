
/**
 * @openapi
 *  components:
 *      parameters:
 *       Id:
 *        in: path
 *        name: id
 *        required: true
 *      schemas:
 *          BlogPost:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: unique identifier of a blog
 *                      example: 1
 *                  title:
 *                      type: string
 *                      description: blog title
 *                      example: "Java is always popular ?"
 *                  content:
 *                      type: string
 *                      description: content of a blog
 *                      example: >
 *                             java is always popular and an enterprise language.
 *                              This is powerful and verbose.
 *                  authorId:
 *                      type: integer
 *                      description: id of the author the blog
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: date and time of creation
 *                      example: "2024-11-17T12:34:56.789Z"
 *                  image:
 *                      type: string
 *                      description: url of the picture.
 *          BlogField:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title of blog
 *                      example: title of blog
 *                  content:
 *                      type: string
 *                      description: the content of blog
 *                      example: content of blog
 *
 *          ErrorResponse:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *                      description: error message
 *                      example: Internal server error, try later.
 *          Author:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      format: email
 *                  username:
 *                      type: string
 *                      example: Myusername
 *                  password:
 *                      type: string
 *                      format: password
 *                  gender:
 *                      type: string
 *                      enum: [M, F]
 *                  role:
 *                      type: string
 *                      enum:
 *                          - USER
 *                          - ADMIN
 *                  bio:
 *                      type: string
 *                      example: My bio
 *          Comment:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: unique identifier of comment.
 *                  content:
 *                      type: string
 *                      description: the content of comment.
 *                  authorId:
 *                      type: integer
 *                      description: unique identifier of author
 *                  postId:
 *                      type: integer
 *                      description: unique identifier of the post commented
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      exemple: "2024-11-17T12:34:56.789Z"
 *                      
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 * 
 * */