import React, { useRef, useState, type KeyboardEvent, type ChangeEvent, type ClipboardEvent } from 'react';
import { Chip } from '@mui/material';

interface EmailChipInputProps {
    emails: string[];
    setEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function EmailChipInput({ emails, setEmails }: EmailChipInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [invalid, setInvalid] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const parseEmails = (value: string): string[] => {
        return value
            .split(/[\s,]+/)
            .map(email => email.trim())
            .filter(email => emailRegex.test(email) && !emails.includes(email));
    };

    const addEmails = (value: string) => {
        const newEmails = parseEmails(value);
        if (newEmails.length) {
            setEmails([...emails, ...newEmails]);
            setInvalid(false);
        } else if (value.trim() && !emailRegex.test(value.trim())) {
            setInvalid(true); // mark as invalid if it's typed but wrong
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', ' ', ','].includes(e.key)) {
            e.preventDefault();
            addEmails(inputValue);
            setInputValue('');
        } else if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
            setEmails(emails.slice(0, -1));
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('Text');
        addEmails(pasted);
        setInputValue('');
    };

    const handleBlur = () => {
        if (inputValue) {
            addEmails(inputValue);
            setInputValue('');
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setInvalid(false); // reset invalid state as user types
    };

    const removeEmail = (emailToRemove: string) => {
        setEmails(emails.filter(email => email !== emailToRemove));
    };

    return (
        <div
            className={`w-full border ${invalid ? 'border-red-500' : 'border-gray-300'
                } rounded p-2 min-h-[60px] flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500`}
            onClick={() => inputRef.current?.focus()}
        >
            {emails.map((email, index) => (
                <Chip
                    key={index}
                    label={email}
                    onDelete={() => removeEmail(email)}
                    className="!text-sm"
                    color="primary"
                />
            ))}
            <input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onPaste={handlePaste}
                className="outline-none flex-grow min-w-[120px] bg-transparent text-sm"
                placeholder="Type or paste emails..."
            />
        </div>
    );
}
