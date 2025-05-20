#!/usr/bin/env python3
import os
import sys
import json
from google.cloud import speech
import numpy as np
import io

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
    # Check if input is provided via stdin
    if not sys.stdin.isatty():
        # Read JSON from stdin
        input_data = json.load(sys.stdin)
        audio_data = input_data.get("audio_data", [])
        sample_rate = input_data.get("sample_rate", 16000)
        language_code = input_data.get("language_code", "en-US")
    else:
        # Handle command line arguments
        if len(sys.argv) < 2:
            print("Usage: python google_speech_transcriber.py <audio_data_file.json> [sample_rate] [language_code]")
            sys.exit(1)
        
        # Read audio data from JSON file
        with open(sys.argv[1], 'r') as f:
            audio_data = json.load(f)
        
        sample_rate = int(sys.argv[2]) if len(sys.argv) > 2 else 16000
        language_code = sys.argv[3] if len(sys.argv) > 3 else "en-US"
    
    # Set up Google Cloud credentials
    # Make sure GOOGLE_APPLICATION_CREDENTIALS environment variable is set
    if "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
        print("Warning: GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")
        print("Set it to the path of your Google Cloud service account key JSON file.")
    
    # Transcribe the audio data
    result = transcribe_audio_data(audio_data, sample_rate, language_code)
    
    # Output the results as JSON
    print(json.dumps(result, indent=2)) 