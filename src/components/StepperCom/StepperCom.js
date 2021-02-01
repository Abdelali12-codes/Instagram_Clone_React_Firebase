import React , {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux'
import HighLights from './HighLights'
import Title from './Title'
import './HighLights.css'
// import Left from '../Settings/Left'
const useStyles = makeStyles((theme) => ({
  root: {
     
    width: '600px',
    height :'600px' ,
   
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['HighLights', 'Title'];
}



const StepperCom =({auth:{uid} , stories 
  , handleChange , handleDialogClose ,handlesavehighlights , selectimage , setSelectimage})=>{
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [text , setText] = useState('')
  const steps = getSteps();

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <HighLights stories={stories} handleChange={handleChange}/>;
      case 1:
        return <Title selectimage={selectimage} setText={setText} text={text}/>;
      
      default:
        return 'Unknown step';
    }
  }
  const isStepOptional = (step) => {
    return step === 3;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    setSelectimage([])
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div className='success__section'>
           
          </div>
        ) : (
          <div className='global__stepper__container'>
            <>
              {getStepContent(activeStep)}
            </>
            <div className='second__section2'>
              {activeStep === 0 ? (<Button variant='outlined' color='default' onClick={handleDialogClose} className={classes.button}>
                  Cancel
              </Button>):(
                <Button variant='outlined' color='default' onClick={handleBack} className={classes.button}>
                     Back
                </Button>
              )}
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

             { activeStep === steps.length - 1 ?( <Button
                variant="contained"
                color="primary"
                onClick={()=>handlesavehighlights(uid , {selectimage , text})}
                className={classes.button}
              >
                Save
              </Button>):(
                <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
               Next
              </Button>
              )}
            </div>
          </div>
        )}
      </div>
  
    </div>
  );
}

const mapStateToProps =(state)=>({
  auth : state.firebase.auth
})
export default connect(mapStateToProps)(StepperCom)