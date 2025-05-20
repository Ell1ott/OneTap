#!/usr/bin/env python3
import os
import json
from google.cloud import speech
import numpy as np
import sys

def transcribe_audio_data(audio_data, sample_rate=16000, language_code="en-US"):
    """
    Transcribe audio data using Google Speech-to-Text API
    
    Args:
        audio_data: Int16Array audio data as a list or array
        sample_rate: Audio sample rate in Hz
        language_code: Language code for transcription
    
    Returns:
        Dictionary with transcription results
    """
    # Convert audio data to numpy array if it's not already
    if not isinstance(audio_data, np.ndarray):
        audio_data = np.array(audio_data, dtype=np.int16)
    
    # Convert numpy array to bytes
    audio_bytes = audio_data.tobytes()
    
    # Initialize the Google Speech client
    client = speech.SpeechClient()
    
    # Configure the audio settings
    audio = speech.RecognitionAudio(content=audio_bytes)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=sample_rate,
        language_code=language_code,
        enable_automatic_punctuation=True,
    )
    
    # Send request to Google Speech-to-Text API
    response = client.recognize(config=config, audio=audio)
    
    # Process the response
    results = []
    for result in response.results:
        alternative = result.alternatives[0]
        results.append({
            "transcript": alternative.transcript,
            "confidence": alternative.confidence
        })
    
    return {
        "results": results,
        "is_final": len(response.results) > 0
    }

if __name__ == "__main__":
    # Check if Google Cloud credentials are set
    if "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
        print("Warning: GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")
        print("Set it to the path of your Google Cloud service account key JSON file.")
        print("Example: set GOOGLE_APPLICATION_CREDENTIALS=path\\to\\your\\key.json (Windows)")
        print("Example: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/key.json (Linux/Mac)")
        print()
    
    print("Paste your Int16Array audio data below (in the format [0, 0, 0, ...]):")
    print("Press Ctrl+D (Linux/Mac) or Ctrl+Z followed by Enter (Windows) when done")
    
    # Read all input lines
    lines = []
    try:
        while True:
            line = input()
            lines.append(line)
    except (EOFError, KeyboardInterrupt):
        pass
    
    # Join the lines and try to extract the array data
    data_str = ' '.join(lines)
    
    # Try to extract array content from various formats
    import re
    array_match = re.search(r'\[(.*?)\]', data_str)
    
    if array_match:
        array_content = array_match.group(1)
        # Parse the comma-separated values
        try:
            audio_data = [int(x.strip()) for x in array_content.split(',') if x.strip() and x.strip() != '…']
            
            print(f"\nProcessing {len(audio_data)} audio samples...")
            
            # Transcribe the audio
            result = transcribe_audio_data(audio_data)
            
            # Print the results
            print("\nTranscription Results:")
            if result["results"]:
                for item in result["results"]:
                    print(f"- {item['transcript']} (Confidence: {item['confidence']:.2f})")
            else:
                print("No transcription results. The audio may be too short or unclear.")
                
        except ValueError as e:
            print(f"Error parsing the audio data: {e}")
            print("Make sure you've pasted the array in the format [0, 0, 0, ...]")
    else:
        print("Could not find an array in the pasted data.")
        print("Make sure you've pasted the array in the format [0, 0, 0, ...]") 