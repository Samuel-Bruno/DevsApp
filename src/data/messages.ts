export type Message = {
  from:string;
  to:string;
  type:string;
  content:any;
  dateTime:number;
  dateString:string;
}

const messages:Message[] = [
  {
    from:'1',
    to:'2',
    type:'text',
    content:'Lorem ipsum dolor',
    dateTime:1659026345237,
    dateString:'2022-07-28'
  },
  {
    from:'1',
    to:'2',
    type:'text',
    content:'Lorem ipsum dolor',
    dateTime:1659026349937,
    dateString:'2022-07-28'
  },
  {
    from:'2',
    to:'1',
    type:'text',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at vulputate arcu, sit amet elementum ex. Maecenas rhoncus augue neque, quis ornare purus lacinia in. Vestibulum imperdiet, odio ut suscipit. ',
    dateTime:1659027030620,
    dateString:'2022-07-28'
  },
  {
    from:'2',
    to:'1',
    type:'text',
    content:'Outra mensagem para testar',
    dateTime:1659030977624,
    dateString:'2022-07-28'
  },
  {
    from:'1',
    to:'2',
    type:'text',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at vulputate arcu, sit amet elementum ex. Maecenas rhoncus augue neque, quis ornare purus lacinia in. Vestibulum imperdiet, odio ut suscipit. ',
    dateTime:1659030985324,
    dateString:'2022-07-28'
  },
  {
    from:'1',
    to:'2',
    type:'text',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at vulputate arcu, sit amet elementum ex. Maecenas rhoncus augue neque, quis ornare purus lacinia in. Vestibulum imperdiet, odio ut suscipit. ',
    dateTime:1659030985324,
    dateString:'2022-07-28'
  },
  {
    from:'1',
    to:'2',
    type:'text',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at vulputate arcu, sit amet elementum ex. Maecenas rhoncus augue neque, quis ornare purus lacinia in. Vestibulum imperdiet, odio ut suscipit. ',
    dateTime:1659030985324,
    dateString:'2022-07-28'
  },
  {
    from:'1',
    to:'2',
    type:'text',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at vulputate arcu, sit amet elementum ex. Maecenas rhoncus augue neque, quis ornare purus lacinia in. Vestibulum imperdiet, odio ut suscipit. ',
    dateTime:1659030985324,
    dateString:'2022-07-28'
  },
]


export default messages