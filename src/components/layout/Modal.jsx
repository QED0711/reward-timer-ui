import { useEffect } from 'react';
import ReactDOM from 'react-dom';

// =========================== ICONS =========================== 
import { RiCloseCircleLine } from 'react-icons/ri'

const Modal = ({
    children,
    closeButton = false,
    onClose = () => { },
    containerStyle=""
}) => {

    // EFFECTS
    useEffect(() => {
        // Function to be run when the 'keydown' event is fired
        const onKeydown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeydown);
        return () => {
            document.removeEventListener('keydown', onKeydown);
        };
    }, []);

    return ReactDOM.createPortal(
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 blur-md" onClick={(e) => e.stopPropagation()} />
            <div className="fixed inset-0 flex items-center justify-center">
                <div className={"relative bg-white p-12 rounded-md " + containerStyle}>
                    {closeButton && <RiCloseCircleLine size={"1.5rem"} className='absolute left-2 top-2 cursor-pointer' onClick={() => onClose()} />}
                    {children}
                </div>
            </div>
        </>,
        document.getElementById('modal-root')
    );
};

export default Modal;
