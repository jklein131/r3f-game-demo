import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Images

// Components
import Message from './Message';

const useStyles = makeStyles(theme => ({
    dialogWindow: ({
        screenWidth,
        screenHeight,
    }: {
        screenWidth: number;
        screenHeight: number;
    }) => {
        const messageBoxHeight = Math.ceil(screenHeight / 3.5);

        return {
            imageRendering: 'pixelated',
            zIndex: 10,
            textTransform: 'uppercase',
            backgroundColor: '#e2b27e',
            border: 'solid',
            borderImage: `url("./dialog-borderbox.png") 6 / 12px 12px 12px 12px stretch`,
            padding: '16px',
            position: 'absolute',
            top: `${Math.ceil(
                screenHeight - (messageBoxHeight + messageBoxHeight * 0.1)
            )}px`,
            width: `${Math.ceil(screenWidth * 0.8)}px`,
            left: '50%',
            transform: 'translate(-50%, 0%)',
            minHeight: `${messageBoxHeight}px`,
        };
    },
    dialogTitle: () => ({
        fontSize: '16px',
        marginBottom: '12px',
        fontWeight: 'bold',
    }),
    dialogFooter: () => ({
        fontSize: '16px',
        cursor: 'pointer',
        textAlign: 'end',
        position: 'absolute',
        right: '12px',
        bottom: '12px',
    }),
}));

const DialogBox = ({
    messages,
    characterName,
    onDialogEnded,
    screenWidth,
    screenHeight,
}) => {
    const [currentMessage, setCurrentMessage] = useState(0);
    const [messageEnded, setMessageEnded] = useState(false);
    const [forceShowFullMessage, setForceShowFullMessage] = useState(false);
    const classes = useStyles({
        screenWidth,
        screenHeight,
    });

    const handleClick = useCallback(() => {
        if (messageEnded) {
            setMessageEnded(false);
            setForceShowFullMessage(false);
            if (currentMessage < messages.length - 1) {
                setCurrentMessage(currentMessage + 1);
            } else {
                setCurrentMessage(0);
                onDialogEnded();
            }
        } else {
            setMessageEnded(true);
            setForceShowFullMessage(true);
        }
    }, [currentMessage, messageEnded, messages.length, onDialogEnded]);

    useEffect(() => {
        const handleKeyPressed = e => {
            if (['Enter', 'Space', 'Escape'].includes(e.code)) {
                handleClick();
            }
        };
        window.addEventListener('keydown', handleKeyPressed);

        return () => window.removeEventListener('keydown', handleKeyPressed);
    }, [handleClick]);

    return (
        <div role="dialog" className={classes.dialogWindow}>
            <div role="dialog" className={classes.dialogTitle}>
                {characterName}
                <h1 className="text-3xl font-bold underline">Hello world!</h1>
            </div>
            <Message
                // action={messages[currentMessage].action}
                message={messages[currentMessage]}
                key={currentMessage}
                forceShowFullMessage={forceShowFullMessage}
                onMessageEnded={() => {
                    setMessageEnded(true);
                }}
            />
            <button type="button" onClick={handleClick} className={classes.dialogFooter}>
                {currentMessage === messages.length - 1 && messageEnded ? 'Ok' : 'Next'}
            </button>
        </div>
    );
};

export default DialogBox;
