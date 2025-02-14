
import { Card,CardContent, Typography, CardActions, Button, CardMedia,SvgIcon } from '@mui/material'
import styles from './ServiceCard.module.css'
import { Link } from 'react-router-dom';

interface ServicesCardProps {
    data: {
      link: string[];
      color: string;
      icon: JSX.Element;
      name: string;
      description: string;
      target: string
    };
  }
  



  const ServicesCard: React.FC<ServicesCardProps> =  (props) => {
    console.log(props.data.link)
    return (
    
    <>    
        <Card className={styles.portCardCl} sx={{borderTop: 8, borderColor: `${props.data.color}`,bgcolor: '#ffffff' }} >
            <CardContent className={styles.portBodyCl} >
                <CardMedia >
                    {/* <img src={imag} width='200'></img> */}
                    {/* <DoubleArrowIcon style={{ fontSize: 60 }}/> */}
                    {/* <DoubleArrowIcon fontSize='large'/> */}
                    {props.data.icon}
                </CardMedia>
                <Typography gutterBottom variant='h5'>{props.data.name}</Typography>
                <Typography variant='body1' color='text.secondary'>{props.data.description}</Typography>

            </CardContent>
            <CardActions className={styles.portButCl}>
                <Link to={props.data.link[0]} target={props.data.target}><Button size='small' >
                    Open</Button></Link>
                    { props.data.link[1] ? 
                    (<Button size='small' href={`${props.data.link[1]}`} >
                    Upload</Button>)
                    :
                    (<></>)}
            </CardActions>
        </Card>
    </>
  )
}

export default ServicesCard