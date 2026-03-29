import os
from PIL import Image, ImageSequence

def create_reversed_gif(input_path, output_path):
    print(f"Opening: {input_path}...")
    
    try:
        with Image.open(input_path) as im:
            # Capture original settings
            original_duration = im.info.get('duration', 100) # Default to 100ms if not found
            original_loop = im.info.get('loop', 0)           # 0 means infinite loop
            
            print("Extracting and processing frames...")
            frames = []
            
            # Convert each frame to RGBA to avoid optimization/transparency glitches
            for frame in ImageSequence.Iterator(im):
                frames.append(frame.copy().convert('RGBA'))
                
            print(f"Total frames extracted: {len(frames)}")
            
            # Reverse the sequence of frames
            frames.reverse()
            
            print(f"Saving reversed GIF to: {output_path}...")
            # Save the new GIF with the original timing
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                duration=original_duration,
                loop=original_loop,
                disposal=2 # Clears the frame before drawing the next one
            )
            
            print("Success! Your reversed GIF is ready.")
            
    except FileNotFoundError:
        print(f"Error: Could not find '{input_path}'. Make sure the file exists.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    # Define your paths based on your current project structure
    input_gif = os.path.join("assets", "lobby.gif")
    output_gif = os.path.join("assets", "lobby_reverse.gif")
    
    create_reversed_gif(input_gif, output_gif)