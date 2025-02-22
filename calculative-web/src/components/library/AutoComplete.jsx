import React, { useState, useRef,useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';

const AutoCompleteComponent = ({
  options,
  label,
  placeholder,
  variant = 'outlined',
  onValueChange,
  name,
  value,
  onChange,
  fullWidth,
  margin,
  ...props
}) => {
  const [typedValue, setTypedValue] = useState('');
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const isDeletingRef = useRef(false);

    // Add this useEffect to sync the internal state with external value
    useEffect(() => {
      setInputValue(value || '');
      setTypedValue(value || '');
    }, [value]);

  const handleInputChange = (event, newInputValue, reason) => {
    if (reason === 'reset') {
      // Option selected from the list
      setTypedValue(newInputValue);
      setInputValue(newInputValue);
      if (onValueChange) {
        onValueChange(newInputValue);
      }
      if (onChange) {
        onChange({
          target: { name, value: newInputValue }
        });
      }
      setOpen(false);
    } else if (reason === 'clear') {
      // User cleared the input
      setTypedValue('');
      setInputValue('');
      setFilteredOptions(options);
      if (onValueChange) {
        onValueChange('');
      }
      if (onChange) {
        onChange({
          target: { name, value: '' }
        });
      }
      setOpen(false);
    } else {
      if (isDeletingRef.current) {
        // User is deleting
        setTypedValue(newInputValue);
        setInputValue(newInputValue);
        setOpen(newInputValue.length > 0);
        
        const newFilteredOptions = options.filter((option) =>
          option.toLowerCase().startsWith(newInputValue.toLowerCase())
        );
        setFilteredOptions(newFilteredOptions);
        
        if (onChange) {
          onChange({
            target: { name, value: newInputValue }
          });
        }
      } else {
        // User is typing, perform autofill
        setTypedValue(newInputValue);
        if (newInputValue.length > 0) {
          const matches = options.filter((option) =>
            option.toLowerCase().startsWith(newInputValue.toLowerCase())
          );
          if (matches.length > 0) {
            const firstMatch = matches[0];
            setInputValue(firstMatch);
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(
                  newInputValue.length,
                  firstMatch.length
                );
              }
            }, 0);
            setFilteredOptions(matches);
            setOpen(true);
            
            if (onChange) {
              onChange({
                target: { name, value: firstMatch }
              });
            }
          } else {
            setInputValue(newInputValue);
            setFilteredOptions([]);
            setOpen(false);
            
            if (onChange) {
              onChange({
                target: { name, value: newInputValue }
              });
            }
          }
        } else {
          setInputValue('');
          setFilteredOptions(options);
          setOpen(false);
          
          if (onChange) {
            onChange({
              target: { name, value: '' }
            });
          }
        }
      }
    }
    isDeletingRef.current = false;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      isDeletingRef.current = true;
    }
    if (event.key === 'Enter') {
      if (onValueChange) {
        onValueChange(inputValue);
      }
      if (onChange) {
        onChange({
          target: { name, value: inputValue }
        });
      }
      setOpen(false);
    } else if (event.key === 'ArrowRight' || event.key === 'Tab') {
      if (inputRef.current) {
        const length = inputValue.length;
        inputRef.current.setSelectionRange(length, length);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
    }
  };

  const renderInput = (params) => (
    <TextField
      {...params}
      label={label}
      placeholder={placeholder}
      variant={variant}
      name={name}
      fullWidth={fullWidth}
      margin={margin}
      onKeyDown={handleKeyDown}
      inputRef={(node) => {
        inputRef.current = node;
        if (params.InputProps.ref) {
          if (typeof params.InputProps.ref === 'function') {
            params.InputProps.ref(node);
          } else if (params.InputProps.ref && 'current' in params.InputProps.ref) {
            params.InputProps.ref.current = node;
          }
        }
      }}
      inputProps={{
        ...params.inputProps,
        autoComplete: 'off',
      }}
    />
  );

  return (
    <Autocomplete
      freeSolo
      options={filteredOptions}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      open={open}
      disableOpenOnFocus
      onClose={() => setOpen(false)}
      renderInput={renderInput}
      {...props}
    />
  );
};

export default AutoCompleteComponent;